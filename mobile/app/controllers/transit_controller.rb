require 'net/http'
require 'uri'
require 'rexml/document'

class TransitController < ApplicationController
  # This is the only controller in the application. It handles grabbing all the WS stuff and parsing it.
  #
  #--
  # It may load a little slowly, do we need to have two? One that starts the cache process and redirects after 10 seconds,
  # and one that retrieves cached data? It's hard to make that work in possibly creaky phone browsers. The big test is if stuff
  # works on the default browsers on my J2ME phone and Ben's Palm TX.
  #++
  # There are quite a few parameters that should be sent. GET or POST is fine, but GET is probably easier.
  # I've tried to follow the syntax used in TBDH
  # * origin {string} lat,lon the starting location
  # * originName {string} the human-readable origin
  # * destination {string} the destination coordinates. The reason for this and the next one is to eliminate one blocking
  #   request to CouchDB.
  # * destName {string} the destination name
  def index
    @tripPlan = getTripPlanForDest(params[:origin], params[:originName], params[:destination], params[:destName], 'TriMet')
  end

  # code abstraction
  protected
  # get a trip plan. Currently uses the TriMet Web Service. The agency option is currently ignored.
  # * fromCoord {string} lat,lon
  # * fromPlace {string} human-readable so it is in the output
  # * toCoord {string} lat,lon
  # * toPlace {string} human-readable so it is in the output
  # * agency {string} The agency to request for
  # Returns the best trip plan, or nil if no trip plan is found
  def getTripPlanForDest (fromCoord, fromPlace, toCoord, toPlace, agency='TriMet')
    Rails.logger.warn("Non-TriMet agency #{agency} requested, using TriMet anyhow") if agency != 'TriMet'

    # TODO: tz
    time = Time.now.strftime('%I:%M %p') # like 10:20 am
      
    # TODO: really should cache these trips server-side
    # Make a request to the TriMet TP WS. This is a reimplementation of some of the stuff in tbdhotel.js
    # Set up the parameters
    tpParams = {
      :fromCoord => fromCoord,
      :fromPlace => fromPlace,
      :toPlace   => toPlace,
      :time      => time,
      :toCoord   => toCoord,
      :Min       => 'X', # fewest transfers,
      :appID     => '828B87D6ABC0A9DF142696F76', # TODO: should this use a different appID from TBDH-JS?
    }

    # Todo: encoding other besides space, like :,/>
    url = 'http://developer.trimet.org/ws/V1/trips/tripplanner'
    tpParams.each do |key, value|
      url += "/#{key}/#{value.gsub(' ', '%20')}"
    end

    uri = URI.parse(url)

    tripsXML = Net::HTTP.get(uri)

    Rails.logger.debug("Trip length: #{tripsXML.length}")
    Rails.logger.debug("Trip: #{tripsXML}")

    doc = REXML::Document.new(tripsXML)

    # kinda like jQuery... not bad
    # costs set the same as TBDH
    lowcost = 10000000000000
    finalItin = nil
    doc.elements.each('response/itineraries/itinerary') do |itin| 
      if itin.elements['time-distance/numberOfTransfers'].text != '0'
        Rails.logger.debug("#{itin.elements['time-distance/numberOfTransfers'].text} transfers in trip")
        next
      end
      
      # TODO: more conditions
      cost = itin.elements['time-distance/duration'].text.to_i + 0.1 * itin.elements['fare/regular'].text.to_f

      # set it here, may be changed by another iteration
      if cost < lowcost
        lowcost = cost
        finalItin = itin
      end
    end

    Rails.logger.debug('No itineraries found') unless finalItin

    return finalItin
  end
end
